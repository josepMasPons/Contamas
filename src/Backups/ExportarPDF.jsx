/* com utilitzar generació pdf   (ExportarPDF)  ***** 20-06-26 *****
/ incorporar al programa :

  revisar que useRef  estigui cridat de react

  import {exportarPDF} from '../Backups/ExportarPDF';
 
  const pdfRef = useRef();

  const exportar_a_PDF = async () => {
      const dataM = new Date();
      const datae2 =  `${dataM.getDate()}/${dataM.getMonth()+1}/${dataM.getFullYear()}`; 
      const generar = () => {
     exportarPDF(pdfRef.current, "proves xxxxx_"+datae2);
   };
   generar();
  };
 
  return
     <div ref={pdfRef}>
       .......
     </div>
   
     <Button className="mb-2"  
                variant="success"
                size="sm"
                onClick={exportar_a_PDF}
                >
                Generar PDF
     </Button>    

  ********************  fi  dossier ************************ */
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportarPDF = async (element,nomFitxer = "document") => {
  console.log('inici exportarPDF - ',element,' - ')
  if (!element) return;
  const canvas = await html2canvas(element,
 // {
 //   scale: 2,
 //   useCORS: true,
 // }
  );
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = 210;
  const pageHeight = 297;
  const imgWidth = pageWidth;
  const imgHeight =
    (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;
  pdf.addImage(
    imgData,
    "PNG",
    0,
    position,
    imgWidth,
    imgHeight
  );
  heightLeft -= pageHeight;
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(
      imgData,
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );

    heightLeft -= pageHeight;
  }
  pdf.save(`${nomFitxer}.pdf`);
};