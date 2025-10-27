import { Request, Response } from "express";
import {
  getComments as repoGetComments,
  createComment as repoCreateComment,
  deleteComment as repoDeleteComment,
  updateComment as repoUpdateComment,
} from "../repositories/CommentsRepository";

export const getComments = async (req: Request, res: Response) => {
  try {
    const exam = req.query.exam as string | undefined;
    const comments = await repoGetComments(exam);
    // Her user objesine avatar: profilePhoto (emoji veya görsel) ekle, yoksa default emoji ata
    const commentsWithAvatar = comments.map((c) => ({
      ...c,
      user: c.user
        ? {
            ...c.user,
            avatar:
              typeof c.user.profilePhoto === "string" &&
              c.user.profilePhoto.trim() !== ""
                ? c.user.profilePhoto
                : "🙂", // default emoji
          }
        : { avatar: "🙂", name: "Anonim" },
    }));
    res.json({ comments: commentsWithAvatar });
  } catch (err) {
    res.status(500).json({ error: "Yorumlar alınamadı." });
  }
};

export const createComment = async (req: Request, res: Response) => {
  try {
    const { text, exam } = req.body;
    const userId = (req.user as any)?.userId || (req.user as any)?.id;
    if (!userId) return res.status(401).json({ error: "Giriş yapmalısınız." });
    if (!text || !exam) return res.status(400).json({ error: "Eksik veri." });
    const comment = await repoCreateComment(text, exam, userId);
    res.json({ comment });
  } catch (err) {
    res.status(500).json({ error: "Yorum kaydedilemedi." });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any)?.userId || (req.user as any)?.id;
    const result = await repoDeleteComment(id, userId);
    if (!result)
      return res
        .status(403)
        .json({ error: "Sadece kendi yorumunuzu silebilirsiniz." });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Yorum silinemedi." });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = (req.user as any)?.userId || (req.user as any)?.id;
    const updated = await repoUpdateComment(id, text, userId);
    if (!updated)
      return res
        .status(403)
        .json({ error: "Sadece kendi yorumunuzu güncelleyebilirsiniz." });
    res.json({ comment: updated });
  } catch (err) {
    res.status(500).json({ error: "Yorum güncellenemedi." });
  }
};
