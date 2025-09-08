export type IncomingImage = {
  imageGroupId: number;
  imageGroupName: string;
  name: string;
  path: string;
  url: string;
  id: number;
  dataHoraCriacao: string;
  usuarioCriacao: number;
  nomeUsuarioCriacao: string;
};

export type Image = {
  id: number;
  name: string;
  url: string;
  path: string;
  imageGroupId: number;
  imageGroupName: string;
  creationUsername: string;
  creationDate: string;
  creationUser: number;
};
