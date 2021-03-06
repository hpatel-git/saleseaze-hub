import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import keycloakConfig from '../config/keycloakConfig';
import Config from '../config';
import UserProfileUpdateRequest from './model/userProfileUpdateRequest';
import UserProfileResponse from './model/userProfileResponse';
import RegisterSocialAccount from './model/registerSocialAccount';
import { SocialAccountsResponse } from './model/socialAccount';
import { FacebookPageResponse } from './model/facebookPage';
import ScrapeUrlResponse from './model/scrapeUrlResponse';
import PublishPostRequest, {
  PublishPostPageResponse,
  PublishPostResponse
} from './model/publishPostRequest';

export const saleseazeApi = createApi({
  reducerPath: 'saleseazeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: Config.root.SALESEAZE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      if (!keycloakConfig.isTokenExpired()) {
        headers.set('Authorization', `Bearer ${keycloakConfig.token}`);
      } else {
        keycloakConfig.login();
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getMyProfile: builder.query<UserProfileResponse, void>({
      query: () => `profiles/me`
    }),
    updateMyProfile: builder.mutation<void, Partial<UserProfileUpdateRequest>>({
      query: ({ ...body }) => ({
        url: `profiles/me`,
        method: 'PUT',
        body
      })
    }),
    fetchRegisteredSocialAccounts: builder.query<SocialAccountsResponse, void>({
      query: () => `accounts`
    }),
    registerSocialAccount: builder.mutation<
      void,
      Partial<RegisterSocialAccount>
    >({
      query: ({ ...body }) => ({
        url: `accounts`,
        method: 'POST',
        body
      })
    }),
    deListSocialAccount: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `accounts/${id}`,
        method: 'DELETE'
      })
    }),
    initiateSyncPages: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `accounts/${id}/sync_pages`,
        method: 'PUT'
      })
    }),
    fetchAccountPages: builder.query<FacebookPageResponse, string>({
      query: (accountId: string) => `accounts/${accountId}/pages`
    }),
    scrapeUrl: builder.query<ScrapeUrlResponse, string>({
      query: (q: string) => `tools/scrap_urls?url=${q}`
    }),
    publishPost: builder.mutation<
      PublishPostResponse,
      Partial<PublishPostRequest>
    >({
      query: ({ ...body }) => ({
        url: `publish_posts`,
        method: 'POST',
        body
      })
    }),
    fetchCompanyPosts: builder.query<PublishPostPageResponse, void>({
      query: () => `publish_posts`
    })
  })
});

export const {
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useFetchRegisteredSocialAccountsQuery,
  useRegisterSocialAccountMutation,
  useDeListSocialAccountMutation,
  useInitiateSyncPagesMutation,
  useFetchAccountPagesQuery,
  useLazyFetchAccountPagesQuery,
  useScrapeUrlQuery,
  usePublishPostMutation,
  useFetchCompanyPostsQuery
} = saleseazeApi;
