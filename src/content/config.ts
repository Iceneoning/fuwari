import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z
		.object({
			title: z.string().trim().min(1, "文章标题不能为空"),
			published: z.date(),
			updated: z.date().optional(),
			draft: z.boolean().optional().default(false),
			description: z.string().trim().optional().default(""),
			image: z.string().trim().optional().default(""),
			tags: z
				.array(z.string())
				.optional()
				.default([])
				.transform((tags) => [
					...new Set(tags.map((tag) => tag.trim()).filter(Boolean)),
				]),
			category: z.enum(["杂谈", "代码"]).optional().nullable().default("代码"),
			lang: z.string().trim().optional().default(""),

			/* For internal use */
			prevTitle: z.string().default(""),
			prevSlug: z.string().default(""),
			nextTitle: z.string().default(""),
			nextSlug: z.string().default(""),
		})
		.superRefine((post, context) => {
			if (post.updated && post.updated < post.published) {
				context.addIssue({
					code: z.ZodIssueCode.custom,
					path: ["updated"],
					message: "更新时间不能早于发布时间",
				});
			}
		}),
});
const specCollection = defineCollection({
	schema: z.object({
		friends: z
			.array(
				z.object({
					name: z.string().trim().min(1, "友链名称不能为空"),
					url: z.string().url("友链地址必须是完整 URL"),
					avatar: z
						.string()
						.trim()
						.min(1)
						.optional()
						.default("/Portrait/default.jpg"),
					description: z.string().trim().optional().default(""),
				}),
			)
			.optional(),
		friendRules: z.array(z.string().trim().min(1)).optional().default([]),
		friendApplication: z
			.object({
				email: z.string().email("友链联系邮箱格式不正确"),
				description: z.string().trim().optional().default(""),
			})
			.optional(),
		siteInfo: z
			.object({
				name: z.string().trim().min(1),
				url: z.string().url("本站友链地址必须是完整 URL"),
				description: z.string().trim().min(1),
				avatar: z.string().trim().min(1),
			})
			.optional(),
	}),
});
export const collections = {
	posts: postsCollection,
	spec: specCollection,
};
