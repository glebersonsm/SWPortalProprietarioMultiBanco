import { RequiredTags, TagsWelcome } from "@/utils/types/tags";

export function transformedTags(requiredTags: TagsWelcome[]) {
  return requiredTags.map((requiredTag) => {
    return {
      id: requiredTag.id,
      name: requiredTag.nome,
    };
  });
}

export function untransformedTags(requiredTags: RequiredTags[]) {
  return requiredTags?.map((requiredTags) => requiredTags?.id) || [];
}
