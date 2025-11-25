export type IncomingImage = {
  imageGroupId: number;
  imageGroupName: string;
  name: string;
  imagem?: string; // base64
  imagemBase64?: string; // base64
  id: number;
  dataHoraCriacao: string;
  usuarioCriacao: number;
  nomeUsuarioCriacao: string;
  tagsRequeridas?: any[];
  nomeBotao?: string;
  linkBotao?: string;
  dataInicioVigencia?: string;
  dataInicioVigenciaStr?: string;
  dataFimVigencia?: string;
  dataFimVigenciaStr?: string;
};

export type Image = {
  id: number;
  name: string;
  imagemBase64?: string; // base64
  imageGroupId: number;
  imageGroupName: string;
  creationUsername: string;
  creationDate: string;
  creationUser: number;
  tagsRequeridas?: any[];
  nomeBotao?: string;
  linkBotao?: string;
  dataInicioVigencia?: string;
  dataFimVigencia?: string;
};
