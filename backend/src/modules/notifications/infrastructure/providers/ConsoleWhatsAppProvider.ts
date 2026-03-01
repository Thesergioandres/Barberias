export class ConsoleWhatsAppProvider {
  async send({ appointmentId, event, roleTarget, phone, message }: { appointmentId: string; event: string; roleTarget: string; phone: string; message: string }) {
    const payload = {
      appointmentId,
      event,
      roleTarget,
      phone,
      message
    };

    console.info('[WhatsApp][Mock]', payload);
    return { status: 'ENVIADO' as const };
  }
}
