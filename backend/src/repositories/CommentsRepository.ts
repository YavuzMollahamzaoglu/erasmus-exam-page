import prisma from '../prismaClient';

export const getComments = async (exam?: string) => {
  return prisma.comment.findMany({
    where: exam ? { exam } : {},
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, id: true } } }
  });
};

export const createComment = async (text: string, exam: string, userId: string) => {
  return prisma.comment.create({
    data: { text, exam, userId }
  });
};

export const deleteComment = async (id: string, userId: string) => {
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment || comment.userId !== userId) return null;
  await prisma.comment.delete({ where: { id } });
  return true;
};

export const updateComment = async (id: string, text: string, userId: string) => {
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment || comment.userId !== userId) return null;
  return prisma.comment.update({ where: { id }, data: { text } });
};
