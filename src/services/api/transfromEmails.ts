import { formatDate } from "@/utils/dates";
import { IncomingEmail } from "@/utils/types/emails";

export function transformedEmails(emails: IncomingEmail[]) {
  return emails.map((email) => {
    return {
      id: email.id,
      creationDate: formatDate(email.dataHoraCriacao),
      creationUser: email.usuarioCriacao,
      creationUsername: email.nomeUsuarioCriacao,
      changeDate: formatDate(email.dataHoraAlteracao),
      changeUser: email.usuarioAlteracao,
      changeUsername: email.nomeUsuarioAlteracao,
      companyId: email.empresaId,
      subject: email.assunto,
      recipient: email.destinatario,
      content: email.conteudoEmail,
      sent: !!email.enviado,
    };
  });
}
