import Post from "../models/Post.js";
import { ApolloError } from "apollo-server-express";
import { NewPostvalidationRules } from "../validators/postValidator.js";
import { UserInputError } from "apollo-server-express";
import { createWriteStream } from "fs";
import { URL } from "../config/index.js";
import shortid from "shortid";

const storeUpload = async (upload) => {
  const { createReadStream, filename, mimetype } = await upload;
  const stream = createReadStream();
  const id = shortid.generate();
  let path = `uploads/${id}-${filename}`;
  await stream.pipe(createWriteStream(path));
  // path = `${URL}/server/${path}`;
  path = `${URL}/server/${path}`;
  return path;
};

const processUpload = async (upload) => {
  const { createReadStream, filename, mimetype } = await upload;

  const stream = createReadStream();
  const file = await storeUpload({ stream, filename, mimetype });
  return file;
};

const myCustomLabels = {
  docs: "posts",
  limit: "perPage",
  nextPage: "next",
  prevPage: "prev",
  meta: "paginator",
  page: "currentPage",
  pagingCounter: "slNo",
  totalDocs: "totalPosts",
  totalPages: "totalPages",
};

export default {
  Query: {
    getAllPosts: async (_, args, { isAuth }) => {
      let posts = Post.find().populate("author");
      return posts;
    },
    getUserPosts: async (_, args, { user }) => {
      try {
        let posts = await Post.find({ author: user._id });
        return posts;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
    getPostById: async (_, { id }) => {
      try {
        let post = Post.findById(id);
        if (!post) {
          throw new Error("Post not found");
        }
        await (await post.populate("author")).execPopulate();
        return post;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
    getPostByCategory: async (_, { category }) => {
      try {
        let posts = await Post.find({ category: category }).populate("author");

        return posts;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
    getPostsByLimitAndPage: async (_, { page, limit }) => {
      const options = {
        page: page || 1,
        limit: limit || 10,
        sort: {
          createdAt: -1,
        },
        populate: "author",
        customLabels: myCustomLabels,
      };

      let post = await Post.paginate({}, options);

      return post;
    },
  },

  Mutation: {
    createNewPost: async (_, { newPost }, { user }) => {
      try {
        const {
          title,
          description,
          featureImage,
          price,
          category,
          author,
        } = newPost;

        await NewPostvalidationRules.validate(
          { title, description, price },
          { abortEarly: false }
        );
        const upload = await Promise.all(featureImage.map(await storeUpload));

        newPost.featureImage = await upload;
        console.log("zakkkk", user.id);
        const post = new Post(newPost);

        let result = await post.save();

        await result.populate("author").execPopulate();
        return result;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
    updatePost: async (_, args, { user }) => {
      try {
        const { post } = args;
        const postO = await Post.findOneAndUpdate(
          { _id: post.id, author: user._id.toString() },
          { ...post },
          {
            new: true,
          }
        );
        if (!postO) {
          throw new Error("unable to edit post");
        }
        return postO;
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
    deletePostById: async (_, { id, owner }, { user }) => {
      try {
        console.log(owner);
        const deletedPost = await Post.findOneAndDelete({
          _id: id,
          // author: user._id.toString(),
          //author: owner,
        });

        if (!deletedPost) {
          throw new Error("unable delete post");
        }
        return {
          owner,
          message: "The post has been deleted",
          success: true,
        };
      } catch (e) {
        throw new ApolloError(e.message);
      }
    },
  },
};
