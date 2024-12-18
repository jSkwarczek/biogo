# BioGO
> Biometria 2024-25, Cyberbezpieczeństwo

## Wymagania

- go (>=1.23.4)
- nodejs (>=23.3.0)
- npm (10.9.0)
- python (>=3.12.3)
- pip (>=24.3.1)
- cmake (>=3.28.3)
- gcc (>=13.2.0)
- libjpeg
- dlib (>=19.10)

## Jak uruchomić?

1. W folderze *client* wykonujemy:
   ```bash
   npm i
   npm start
   ```
2. W głównym katalogu projektu wykonujemy:
   ```bash
   go mod tidy
   go run main.go
   ```
   
3. W katalogu *model* wykonujemy:
   ```bash
   pip install -r requirements.txt
   python main.py
   ```
