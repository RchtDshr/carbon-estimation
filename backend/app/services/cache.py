import os
import json
import hashlib
import time
import redis.asyncio as redis
from typing import Optional, Dict, Any
from pydantic import BaseModel

class CacheService:
    def __init__(self):
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        self.redis = None
        self.cache_ttl = 60 * 60 * 24 * 7  # 7 days in seconds
    
    async def connect(self):
        """Initialize Redis connection"""
        if not self.redis:
            self.redis = redis.from_url(
                self.redis_url,
                encoding="utf-8",
                decode_responses=True
            )
    
    async def disconnect(self):
        """Close Redis connection"""
        if self.redis:
            await self.redis.aclose()
    
    def _generate_cache_key(self, dish_name: str, estimation_type: str = "text") -> str:
        """Generate a consistent cache key for a dish name"""
        # Normalize dish name: lowercase, strip whitespace, remove special chars
        normalized_dish = dish_name.lower().strip()
        # Create a hash to handle special characters and ensure consistent key format
        dish_hash = hashlib.md5(normalized_dish.encode()).hexdigest()
        # Remove estimation_type from cache key so both text and image use same cache
        return f"carbon_footprint:{dish_hash}:{normalized_dish}"
    
    async def get_cached_result(self, dish_name: str, estimation_type: str = "text") -> Optional[Dict[Any, Any]]:
        """Get cached carbon footprint result for a dish"""
        try:
            await self.connect()
            cache_key = self._generate_cache_key(dish_name, estimation_type)
            
            cached_data = await self.redis.get(cache_key)
            if cached_data:
                return json.loads(cached_data)
            return None
        except Exception as e:
            print(f"Cache get error: {e}")
            return None
    
    async def cache_result(self, dish_name: str, result: Dict[Any, Any], estimation_type: str = "text") -> bool:
        """Cache carbon footprint result for a dish"""
        try:
            await self.connect()
            cache_key = self._generate_cache_key(dish_name, estimation_type)
            
            # Add cache metadata
            cache_data = {
                **result,
                "cached_at": str(time.time()),
                "cache_key": cache_key
            }
            
            await self.redis.setex(
                cache_key,
                self.cache_ttl,
                json.dumps(cache_data, default=str)
            )
            return True
        except Exception as e:
            print(f"Cache set error: {e}")
            return False
    
    async def invalidate_cache(self, dish_name: str, estimation_type: str = "text") -> bool:
        """Invalidate cached result for a dish"""
        try:
            await self.connect()
            cache_key = self._generate_cache_key(dish_name, estimation_type)
            await self.redis.delete(cache_key)
            return True
        except Exception as e:
            print(f"Cache invalidation error: {e}")
            return False
    
    async def get_cache_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        try:
            await self.connect()
            info = await self.redis.info()
            keys_count = await self.redis.dbsize()
            
            return {
                "total_keys": keys_count,
                "used_memory": info.get("used_memory_human", "Unknown"),
                "connected_clients": info.get("connected_clients", 0),
                "redis_version": info.get("redis_version", "Unknown")
            }
        except Exception as e:
            print(f"Cache stats error: {e}")
            return {"error": str(e)}

# Global cache service instance
cache_service = CacheService()
