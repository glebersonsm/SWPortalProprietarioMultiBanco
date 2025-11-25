import { ImagemGrupoImagemHome } from "@/services/querys/imagem-grupo-imagem-home";
import { RequiredTags } from "@/utils/types/tags";

type IncomingImagemTags = {
  id?: number;
  imagemGrupoImagemHomeId?: number;
  tags?: {
    id?: number;
    Id?: number;
    nome?: string;
    name?: string;
    Nome?: string;
    [key: string]: any;
  };
  Tags?: {
    id?: number;
    Id?: number;
    nome?: string;
    name?: string;
    Nome?: string;
    [key: string]: any;
  };
};

type IncomingImagemGrupoImagemHome = Omit<ImagemGrupoImagemHome, 'tagsRequeridas'> & {
  tagsRequeridas?: IncomingImagemTags[];
};

export function transformImagemGrupoImagemHome(
  data: IncomingImagemGrupoImagemHome[]
): ImagemGrupoImagemHome[] {
  return data.map((imagem) => {
    let transformedTags: RequiredTags[] | undefined = undefined;

    const tagsRequeridas = (imagem as any).tagsRequeridas as IncomingImagemTags[] | undefined;

    if (
      tagsRequeridas &&
      Array.isArray(tagsRequeridas) &&
      tagsRequeridas.length > 0
    ) {
      transformedTags = tagsRequeridas
        .map((tagRelation) => {
          const tagEntity = tagRelation.tags || tagRelation.Tags;
          if (!tagEntity) {
            return null;
          }

          const tagId = tagEntity.id ?? tagEntity.Id;
          const tagName =
            tagEntity.nome ||
            tagEntity.name ||
            tagEntity.Nome ||
            (tagEntity as any)?.Nome ||
            "";

          if (!tagId || !tagName) {
            return null;
          }

          return {
            id: tagId,
            name: tagName,
          };
        })
        .filter(
          (tag): tag is RequiredTags =>
            tag !== null && tag.id !== undefined && tag.name !== ""
        );

      if (transformedTags.length === 0) {
        transformedTags = undefined;
      }
    }

    return {
      ...imagem,
      tagsRequeridas: transformedTags,
    };
  });
}

