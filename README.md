# AI-Powered Cancer Cell Detection

An advanced web application for detecting and classifying cancer cells in histopathological images using the Swin Transformer architecture.

## Features

- Real-time cancer cell detection and classification
- Interactive 3D cell visualization
- Modern, responsive user interface
- Secure file upload and processing
- Detailed analysis results with confidence scores

## Tech Stack

### Frontend
- Next.js 15.1.0
- React 19.0.0
- Three.js for 3D visualization
- Tailwind CSS for styling
- TypeScript for type safety

### Backend
- Flask
- ONNX Runtime
- Python 3.8+
- OpenCV for image processing

## Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 18 or higher
- pnpm package manager

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv env
   ```
3. Activate the virtual environment:
   - Windows: `env\Scripts\activate`
   - Unix/macOS: `source env/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```

## Usage

1. Open http://localhost:3000 in your browser
2. Upload a histopathological image
3. Wait for the analysis to complete
4. View the detailed results with confidence scores

## Contact

For support or inquiries:
- Email: info@celldetect.ai
- Phone: +91 80628 38283
- Address: 1A-029, King's Palace-12, Campus-8, KIIT Road, Patia, Bhubaneswar, India (751024)

## License

MIT License - see LICENSE file for details 