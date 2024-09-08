const express = require('express');
const bodyParser = require('body-parser');
const { PDFDocument, rgb } = require('pdf-lib');

const app = express();
app.use(bodyParser.json());

app.post('/create-pdf', async (req, res) => {
    const { applicantName, companyName, idNumber, companyId, phone, email, date, businessType, documents } = req.body;

    // יצירת PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    // הוספת המידע הבסיסי
    page.drawText(`שם המבקש: ${applicantName}`, { x: 50, y: 750, size: 18, color: rgb(0, 0, 0) });
    page.drawText(`שם החברה: ${companyName}`, { x: 50, y: 720, size: 18 });
    page.drawText(`ת.ז: ${idNumber}`, { x: 50, y: 690, size: 18 });
    page.drawText(`ח.פ: ${companyId}`, { x: 50, y: 660, size: 18 });
    page.drawText(`טלפון: ${phone}`, { x: 50, y: 630, size: 18 });
    page.drawText(`מייל: ${email}`, { x: 50, y: 600, size: 18 });
    page.drawText(`תאריך: ${date}`, { x: 50, y: 570, size: 18 });

    // הוספת מידע על המסמכים הנדרשים
    let yPosition = 540;
    if (businessType === 'soleTrader') {
        page.drawText('מסמכים נדרשים - עוסק מורשה:', { x: 50, y: yPosition, size: 18 });
        yPosition -= 30;
        page.drawText(`טופס בקשה חתום: ${documents.soleTraderForm}`, { x: 50, y: yPosition, size: 16 });
        yPosition -= 30;
        page.drawText(`תעודת עוסק מורשה: ${documents.soleTraderCertificate}`, { x: 50, y: yPosition, size: 16 });
        yPosition -= 30;
        page.drawText(`תעודת זהות: ${documents.soleTraderId}`, { x: 50, y: yPosition, size: 16 });
        yPosition -= 30;
        page.drawText(`חוזה שכירות: ${documents.soleTraderLease}`, { x: 50, y: yPosition, size: 16 });
        yPosition -= 30;
        page.drawText(`תצהיר חתום: ${documents.soleTraderDeclaration}`, { x: 50, y: yPosition, size: 16 });
    } else if (businessType === 'corporation') {
        page.drawText('מסמכים נדרשים - תאגיד:', { x: 50, y: yPosition, size: 18 });
        yPosition -= 30;
        page.drawText(`טופס בקשה חתום: ${documents.corporationForm}`, { x: 50, y: yPosition, size: 16 });
        yPosition -= 30;
        page.drawText(`תעודת התאגדות: ${documents.corporationCertificate}`, { x: 50, y: yPosition, size: 16 });
        yPosition -= 30;
        page.drawText(`פרוטוקול מורשה חתימה: ${documents.corporationSignatory}`, { x: 50, y: yPosition, size: 16 });
        yPosition -= 30;
        page.drawText(`תעודת זהות: ${documents.corporationId}`, { x: 50, y: yPosition, size: 16 });
        yPosition -= 30;
        page.drawText(`חוזה שכירות: ${documents.corporationLease}`, { x: 50, y: yPosition, size: 16 });
        yPosition -= 30;
        page.drawText(`תצהיר חתום: ${documents.corporationDeclaration}`, { x: 50, y: yPosition, size: 16 });
    }

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="רישיון_סחר.pdf"');
    res.send(Buffer.from(pdfBytes));
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
