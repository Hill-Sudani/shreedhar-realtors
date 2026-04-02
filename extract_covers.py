import os
import fitz

BASE_DIR = r"d:\Documents\Shreedhar Website"
RAW_DIR = os.path.join(BASE_DIR, "raw-materials")
OUT_DIR = os.path.join(BASE_DIR, "images", "extracted")

if not os.path.exists(OUT_DIR):
    os.makedirs(OUT_DIR)

pdf_files = [f for f in os.listdir(RAW_DIR) if f.lower().endswith(".pdf")]

for pdf in pdf_files:
    pdf_path = os.path.join(RAW_DIR, pdf)
    print(f"Processing: {pdf_path}")
    try:
        doc = fitz.open(pdf_path)
        # Try to find a good cover page
        # Usually page 0
        page = doc.load_page(0)
        pix = page.get_pixmap(dpi=150)
        out_name = pdf.replace('.pdf', '.png').replace('.PDF', '.png')
        out_path = os.path.join(OUT_DIR, out_name)
        pix.save(out_path)
        print(f"Saved cover for {pdf} at {out_path}")
    except Exception as e:
        print(f"Failed to process {pdf}: {e}")
