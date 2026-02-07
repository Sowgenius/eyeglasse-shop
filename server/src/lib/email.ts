import { env } from '@/config';
import { Resend } from 'resend';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export interface EmailData {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(data: EmailData) {
  if (!resend) {
    console.warn('Resend not configured. Email not sent:', data.subject);
    return null;
  }

  try {
    const result = await resend.emails.send({
      from: data.from || 'Optician Pro <noreply@optician.pro>',
      to: data.to,
      subject: data.subject,
      html: data.html,
    });

    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

export function generateQuoteEmail(quoteNumber: string, total: number, validUntil: Date): string {
  return `
    <h1>Devis ${quoteNumber}</h1>
    <p>Merci pour votre confiance. Voici votre devis d'un montant de ${total}€.</p>
    <p>Ce devis est valable jusqu'au ${validUntil.toLocaleDateString('fr-FR')}.</p>
    <p>Pour accepter ce devis, veuillez nous contacter ou passer directement en magasin.</p>
  `;
}

export function generateInvoiceEmail(invoiceNumber: string, total: number, balanceDue: number): string {
  return `
    <h1>Facture ${invoiceNumber}</h1>
    <p>Veuillez trouver ci-joint votre facture d'un montant de ${total}€.</p>
    ${balanceDue > 0 ? `<p>Solde restant dû: ${balanceDue}€</p>` : '<p>Merci pour votre règlement complet.</p>'}
  `;
}
