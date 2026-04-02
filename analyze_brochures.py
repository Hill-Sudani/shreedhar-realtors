import os
import fitz

BASE_DIR = r"d:\Documents\Shreedhar Website"
RAW_DIR = os.path.join(BASE_DIR, "raw-materials")
OUT_DIR = os.path.join(BASE_DIR, "images", "brochure_pages")

if not os.path.exists(OUT_DIR):
    os.makedirs(OUT_DIR)

pdf_files = sorted([f for f in os.listdir(RAW_DIR) if f.lower().endswith(".pdf")])

for pdf in pdf_files:
    pdf_path = os.path.join(RAW_DIR, pdf)
    doc = fitz.open(pdf_path)
    num_pages = len(doc)
    safe_name = pdf.replace('.pdf', '').replace('.PDF', '').replace(' ', '_')
    
    # Create subfolder for each brochure
    brochure_dir = os.path.join(OUT_DIR, safe_name)
    if not os.path.exists(brochure_dir):
        os.makedirs(brochure_dir)
    
    print(f"\n=== {pdf} === ({num_pages} pages)")
    
    # Extract ALL pages at reasonable quality
    for page_num in range(num_pages):
        page = doc.load_page(page_num)
        pix = page.get_pixmap(dpi=200)
        out_path = os.path.join(brochure_dir, f"page_{page_num:02d}.png")
        pix.save(out_path)
        print(f"  Saved page {page_num} -> {out_path}")
    
    doc.close()

print("\n\nDone! All pages extracted.")
