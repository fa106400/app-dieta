import jsPDF from "jspdf";

// Shopping Plan JSONB Structure Interfaces
interface ShoppingItem {
  name: string;
  quantity: number;
  unit: string;
  icon: null;
}

interface AltItem {
  name: string;
  icon: null;
}

interface ShoppingPlan {
  main_items: ShoppingItem[];
  alt_items: AltItem[];
}

interface CurrentDiet {
  id: string;
  title: string;
  description: string;
  shopping_plan: ShoppingPlan;
}

interface PDFExportOptions {
  diet: CurrentDiet;
  selectedPeriod: "week" | "month";
  calculateQuantity: (baseQuantity: number) => number;
  converteMedidas: (quantidade: number, unidade: string) => string;
}

export function generateShoppingListPDF({
  diet,
  selectedPeriod,
  calculateQuantity,
  converteMedidas,
}: PDFExportOptions): void {
  const doc = new jsPDF({ orientation: "portrait" });
  
  // Set up fonts and colors
  doc.setFont("helvetica");
  
  // Header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Shopping List", 20, 30);
  
  // Diet title
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(diet.title, 20, 45);
  
  // Period information
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  const periodText = selectedPeriod === "week" ? "1 Week" : "1 Month (30 days)";
  doc.text(`Period: ${periodText}`, 20, 55);
  
  // Date
  const currentDate = new Date().toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated on: ${currentDate}`, 20, 65);
  
  let yPosition = 80;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const lineHeight = 8;
  
  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number = lineHeight) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };
  
  // Main Ingredients Section
  if (diet.shopping_plan.main_items.length > 0) {
    // Section header
    checkNewPage(15);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Main Ingredients", 20, yPosition);
    yPosition += 10;
    
    // Items
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    diet.shopping_plan.main_items.forEach((item, index) => {
      checkNewPage();
      
      // Item name
      doc.setFont("helvetica", "bold");
      doc.text(`${index + 1}. ${item.name}`, 25, yPosition);
      
      // Quantity
      doc.setFont("helvetica", "normal");
      const quantity = converteMedidas(calculateQuantity(item.quantity), item.unit);
      doc.text(`   ${quantity}`, 25, yPosition + 5);
      
      yPosition += 12;
    });
    
    yPosition += 10; // Extra space after main items
  }
  
  // Alternative Ingredients Section
  if (diet.shopping_plan.alt_items.length > 0) {
    // Section header
    checkNewPage(15);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Alternative Ingredients", 20, yPosition);
    yPosition += 10;
    
    // Description
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Optional ingredients for daily use", 25, yPosition);
    yPosition += 8;
    
    // Items
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    diet.shopping_plan.alt_items.forEach((item, index) => {
      checkNewPage();
      
      // Item name
      doc.setFont("helvetica", "normal");
      doc.text(`${index + 1}. ${item.name}`, 25, yPosition);
      
      yPosition += 8;
    });
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 10
    );
  }
  
  // Generate filename
  const periodSuffix = selectedPeriod === "week" ? "week" : "month";
  const dateSuffix = new Date().toISOString().split("T")[0];
  const filename = `shopping-list-${periodSuffix}-${dateSuffix}.pdf`;
  
  // Save the PDF
  doc.save(filename);
}

// Helper function to create a simple PDF export for testing
export function generateSimplePDF(title: string, items: string[]): void {
  const doc = new jsPDF({ orientation: "portrait" });
  
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(title, 20, 30);
  
  let yPosition = 50;
  items.forEach((item, index) => {
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`${index + 1}. ${item}`, 20, yPosition);
    yPosition += 10;
  });
  
  doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}
