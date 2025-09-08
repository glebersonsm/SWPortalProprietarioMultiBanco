export type RequiredTagsWelcome = {
  id: number;
  usuarioId: number;
  tags: TagsWelcome;
};

export type TagsWelcome = {
  id: number;
  nome: string;
  path: string;
  usuarioAlteracao: number;
  usuarioCriacao: number;
};

export type RequiredTags = {
  id: number;
  name: string;
};
