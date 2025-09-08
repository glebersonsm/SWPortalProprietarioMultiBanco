import { Image, IncomingImage } from "./images";
import { RequiredTags, RequiredTagsWelcome } from "./tags";

export type IncomingGroupImages = {
  id: number;
  dataHoraCriacao: string;
  usuarioCriacao: number;
  nomeUsuarioCriacao: string;
  dataHoraAlteracao: string;
  usuarioAlteracao: number;
  nomeUsuarioAlteracao: string;
  companyId: number;
  name: string;
  images: IncomingImage[];
  tagsRequeridas: RequiredTagsWelcome[];
};

export type GroupImages = {
  name: string;
  id: number;
  companyId: number;
  creationUser: number;
  images: Image[];
  requiredTags?: RequiredTags[] | null;
};

export type GroupsImages = {
  groupsImages: GroupImages[];
  lastPageNumber: number;
  pageNumber: number;
};

export type FiltersProps = {
  id: string;
  name: string;
  creationUser: string;
};
