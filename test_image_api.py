import requests

def test_image_api():
    # Replace with the path to your food image
    image_path = "path/to/your/food_image.jpg"
    
    url = "http://localhost:8000/api/estimate/image"
    
    try:
        with open(image_path, 'rb') as image_file:
            files = {'file': image_file}
            response = requests.post(url, files=files)
            
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
    except FileNotFoundError:
        print(f"Image file not found: {image_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_image_api()
