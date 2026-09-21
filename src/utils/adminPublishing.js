export function isPublishedStatus(status) {
  return ['aprovada', 'approved', 'publicada'].includes(status);
}

export function getAdminNewsStatusLabel(status) {
  if (isPublishedStatus(status)) return 'Publicada';
  if (status === 'aguardando_avaliacao') return 'Em revisao';
  if (status === 'reprovada') return 'Arquivada';
  return 'Rascunho';
}

function itemTime(item) {
  return new Date(item.updatedAt || item.updated_at || item.publishedAt || item.published_at || 0).getTime() || 0;
}

export function sortAdminNewsItems(items = []) {
  return [...items].sort((a, b) => {
    const aPublished = isPublishedStatus(a.status);
    const bPublished = isPublishedStatus(b.status);

    if (aPublished !== bPublished) {
      return aPublished ? 1 : -1;
    }

    return itemTime(b) - itemTime(a);
  });
}
