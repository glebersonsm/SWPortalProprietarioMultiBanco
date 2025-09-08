import { IncomingGroupImages } from "@/utils/types/groupImages";

export function transformedGroupImages(groupsImages: IncomingGroupImages[]) {
  return groupsImages.map((groupImages) => {
    const requiredTags = groupImages.tagsRequeridas?.map((tag) => {
      return {
        id: tag.tags.id,
        name: tag.tags.nome,
    }});

    const images = groupImages.images?.map((image) => ({
      id: image.id,
      name: image.name,
      url: image.url,
      path: image.path,
      imageGroupId: image.imageGroupId,
      imageGroupName: image.imageGroupName,
      creationUsername: image.nomeUsuarioCriacao,
      creationDate: image.dataHoraCriacao,
      creationUser: image.usuarioCriacao,
      tags: requiredTags,
    }));

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