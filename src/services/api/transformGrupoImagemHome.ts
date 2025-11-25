import { GrupoImagemHome } from "@/services/querys/grupo-imagem-home";
import { RequiredTags } from "@/utils/types/tags";

type IncomingGrupoImagemHomeTags = {
  id?: number;
  grupoImagemHomeId?: number;
  tags?: {
    id?: number;
    nome?: string;
    name?: string;
    Nome?: string; // Backend retorna com N maiúsculo (TagsModel.Nome)
    [key: string]: any; // Para aceitar outras propriedades
  };
  Tags?: {
    // Também pode vir com T maiúsculo
    id?: number;
    nome?: string;
    name?: string;
    Nome?: string;
    [key: string]: any;
  };
};

type IncomingGrupoImagemHome = {
  id?: number;
  companyId?: number;
  name?: string;
  images?: any[];
  tagsRequeridas?: IncomingGrupoImagemHomeTags[];
};

export function transformedGrupoImagemHome(
  data: IncomingGrupoImagemHome[]
): GrupoImagemHome[] {
  return data.map((grupo) => {
    // Transforma as tags do formato do backend para o formato do frontend
    let transformedTags: RequiredTags[] | undefined = undefined;
    
    // Debug temporário
    if (grupo.tagsRequeridas && grupo.tagsRequeridas.length > 0) {
      console.log("Tags recebidas do backend:", JSON.stringify(grupo.tagsRequeridas, null, 2));
    }
    
    if (grupo.tagsRequeridas && Array.isArray(grupo.tagsRequeridas) && grupo.tagsRequeridas.length > 0) {
      transformedTags = grupo.tagsRequeridas
        .map((tagItem) => {
          // O backend retorna: { id, grupoImagemHomeId, tags: { id, Nome, ... } }
          // Pode vir como 'tags' (minúsculo) ou 'Tags' (maiúsculo)
          const tags = tagItem.tags || tagItem.Tags || (tagItem as any).tags;
          
          if (!tags || (tags.id === undefined && tags.Id === undefined)) {
            return null;
          }
          
          const tagId = tags.id || tags.Id;
          if (!tagId) {
            return null;
          }
          
          // Tenta diferentes formatos de nome que podem vir do backend
          // TagsModel tem a propriedade 'Nome' (com N maiúsculo)
          const tagName = 
            tags.nome || 
            tags.name || 
            tags.Nome || 
            (tags as any)?.Nome || 
            "";
          
          if (!tagName) {
            return null;
          }
          
          return {
            id: tagId,
            name: tagName,
          };
        })
        .filter((tag): tag is RequiredTags => tag !== null && tag.id !== undefined && tag.name !== "");
      
      // Se não houver tags válidas após o filtro, retorna undefined
      if (transformedTags.length === 0) {
        transformedTags = undefined;
      }
    }

    return {
      ...grupo,
      tagsRequeridas: transformedTags,
    };
  });
}

