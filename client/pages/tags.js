import React, { useEffect, useState } from 'react'
import Head from 'next/head'

import { publicFetch } from '../util/fetcher'
import { useRouter } from 'next/router'
import Layout from '../components/layout'
import PageTitle from '../components/page-title'
import SearchInput from '../components/search-input'
import TagList from '../components/tag-list'
import TagItem from '../components/tag-list/tag-item'
import { Spinner } from '../components/icons'
import Panginations from '../components/pangination'
function TagsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(null)
  const [tags, setTags] = useState(null)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    var request = {
      params: {
        page: router.query.pagee ? router.query.pagee : 1,
        size: 30
      }
    }
    if (searchTerm === null) {
      const fetchUser = async () => {
        const { data } = await publicFetch.get('/tags',request)
        setTags(data.tag)
        setTotalPage(data.pageNum)  
        setCurrentPage(data.currentPage)

      }
      fetchUser()
    } else {
      const delayDebounceFn = setTimeout(async () => {
        setLoading(true)
        const { data } = await publicFetch.get(
          searchTerm ? `/tags/${searchTerm}` : `/tags`,request
        )
        setTags(data.tag)
        setTotalPage(data.pageNum)  
        setCurrentPage(data.currentPage)
        setLoading(false)
      }, 500)

      return () => clearTimeout(delayDebounceFn)
    }
  }, [searchTerm,router.query.pagee])

  return (
    <Layout extra={false}>
      <Head>
        <title>Tags - Clone of Stackoverflow</title>
        <link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet' />
      </Head>

      <PageTitle title="Tags" borderBottom={false}>
        A tag is a keyword or label that categorizes your question with other,
        similar questions. Using the right tags makes it easier for others to
        find and answer your question.
      </PageTitle>
      
      <SearchInput
        placeholder="Filter by tag name"
        autoFocus
        isLoading={loading}
        autoComplete="off"
        type="text"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {!tags && (
        <div className="loading">
          <Spinner />
        </div>
      )}

      {tags && (
        <>
          <TagList>
            {tags?.map(({ count, _id }) => (
              <TagItem key={_id} count={count}>
                {_id}
              </TagItem>
            ))}
          </TagList>

          {tags.length == 0 && <p className="not-found">No tags matched your search.</p>}
        </>
      )}
       <Panginations currentPage={currentPage} totalPage={totalPage} />
    </Layout>
  )
}

export default TagsPage