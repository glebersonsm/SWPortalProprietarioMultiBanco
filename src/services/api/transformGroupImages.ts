import { IncomingGroupImages } from "@/utils/types/groupImages";

export function transformedGroupImages(groupsImages: IncomingGroupImages[]) {
  return groupsImages.map((groupImages) => {
    const requiredTags = groupImages.tagsRequeridas?.map((tag) => {
      return {
        id: tag.tags.id,
        name: tag.tags.nome,
    }});

    const images = groupImages.images?.map((image) => {
      // Converter DateTime para string se necessário
      let dataInicioVigencia = image.dataInicioVigenciaStr || image.dataInicioVigencia;
      if (dataInicioVigencia && typeof dataInicioVigencia === 'string' && dataInicioVigencia.includes('T')) {
        dataInicioVigencia = dataInicioVigencia.split('T')[0];
      }
      
      let dataFimVigencia = image.dataFimVigenciaStr || image.dataFimVigencia;
      if (dataFimVigencia && typeof dataFimVigencia === 'string' && dataFimVigencia.includes('T')) {
        dataFimVigencia = dataFimVigencia.split('T')[0];
      }

      // Transformar tags requeridas
      const tagsRequeridas = image.tagsRequeridas?.map((tag: any) => {
        // A tag pode vir como { tags: { id, nome } } ou { tags: { Id, Nome } }
        const tagsObj = tag.tags || tag.Tags || tag;
        return {
          id: tagsObj.id || tagsObj.Id,
          name: tagsObj.nome || tagsObj.Nome || tagsObj.name || tagsObj.Name,
        };
      }).filter((tag: any) => tag.id !== undefined && tag.id !== null);

      return {
        id: image.id,
        name: image.name,
        imagemBase64: image.imagemBase64 || image.imagem,
        imageGroupId: image.imageGroupId,
        imageGroupName: image.imageGroupName,
        creationUsername: image.nomeUsuarioCriacao,
        creationDate: image.dataHoraCriacao,
        creationUser: image.usuarioCriacao,
        tagsRequeridas: tagsRequeridas || [],
        nomeBotao: image.nomeBotao,
        linkBotao: image.linkBotao,
        dataInicioVigencia: dataInicioVigencia,
        dataFimVigencia: dataFimVigencia,
      };
    });

    return {
      id: groupImages.id,
      name: groupImages.name,
      creationUser: groupImages.usuarioCriacao,
      companyId: groupImages.companyId,
      images: images,
      requiredTags
    };
  });
}
