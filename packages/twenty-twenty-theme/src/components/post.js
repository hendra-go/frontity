import { styled, connect } from "frontity";
import React, { useEffect } from "react";
import FeaturedMedia from "./featured-media";
import {
  EntryContent,
  getCategories,
  getTags,
  Post as ArticlePost,
  PostHeader,
  PostInner,
  PostTitle,
  SectionContainer
} from "./list/article";
import PostCategories from "./list/post-categories";
import PostMeta from "./list/post-meta";
import PostTags from "./list/post-tags";

const Post = ({ state, actions, libraries }) => {
  // Get information about the current URL.
  const data = state.source.get(state.router.link);
  // Get the data of the post.
  const post = state.source[data.type][data.id];
  // Get the data of the author.
  // const author = state.source.author[post.author];
  // Get a human readable date.
  // const date = new Date(post.date);

  // Get the html2react component.
  const Html2React = libraries.html2react.Component;

  const { hasTags, tags } = getTags(state, post);
  const { hasCategories, categories } = getCategories(state, post);

  /**
   * Once the post has loaded in the DOM, prefetch both the
   * home posts and the list component so if the user visits
   * the home page, everything is ready and it loads instantly.
   */
  useEffect(() => {
    actions.source.fetch("/");
    // Posts.preload();
  }, []);

  // Load the post, but only if the data is ready.
  return data.isReady ? (
    <PostArticle>
      <Header>
        <SectionContainer>
          {/* If the post has categories, render the categories */}
          {hasCategories && <PostCategories categories={categories} />}

          <PostTitle
            as="h1"
            className="heading-size-1"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {/* The post's metadata like author, publish date, and comments */}
          <PostMeta item={post} />
        </SectionContainer>
      </Header>

      {/*
       * If the want to show featured media in the
       * list of featured posts, we render the media.
       */}
      {state.theme.featuredMedia.showOnPost && (
        <FeaturedImage id={post.featured_media} isSinglePost={true} />
      )}

      {/* If the post has an excerpt (short summary text), we render it */}
      {post.content && (
        <PostInner size="thin">
          <EntryContent>
            <Html2React html={post.content.rendered} />
          </EntryContent>
          {/* If the post has tags, render it */}
          {hasTags && <PostTags tags={tags} />}
        </PostInner>
      )}
    </PostArticle>
  ) : null;
};

export default connect(Post);

const Header = styled(PostHeader)`
  background-color: #fff;
  margin: 0;
  padding: 4rem 0;
  @media (min-width: 700px) {
    padding: 8rem 0;
  }
`;

const PostArticle = styled(ArticlePost)`
  padding-top: 0 !important;
`;

const FeaturedImage = styled(FeaturedMedia)`
  margin-top: 0 !important;
  position: relative;

  > div {
    position: relative;
    width: 100vw !important;
  }

  &:before {
    background: #fff;
    content: "";
    display: block;
    position: absolute;
    bottom: 50%;
    left: 0;
    right: 0;
    top: 0;
  }
`;
