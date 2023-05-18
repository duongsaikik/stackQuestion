import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'

import { AuthContext } from '../../../store/auth'
import { FetchContext } from '../../../store/fetch'

import Tag from '../../tag'

import styles from './post-summary.module.css'

const PostSummary = ({
  tags,
  author,
  created,
  questionId,
  answerId,
  setQuestion,
  children,
  editTime
}) => {
  const { authState, isAdmin } = useContext(AuthContext)
  const { authAxios } = useContext(FetchContext)
  const router = useRouter()
  console.log(authState, author)
  const handleDeleteComment = async () => {
    const res = window.confirm('Bạn có chắc là muốn xoá bài viết này không?')
    if (res) {
      const { data } = await authAxios.delete(
        answerId
          ? `/answer/${questionId}/${answerId}`
          : `/question/${questionId}`
      )

      if (answerId) {
        console.log(data)
        setQuestion(data)
      } else {
        router.push('/')
      }
    }
  }

  return (
    <div className={styles.postCell}>
      <div
        className={styles.text}
        dangerouslySetInnerHTML={{ __html: children }}
      ></div>
      <div className={styles.footer}>
        <div className={styles.row}>
          <div className={styles.tagContainer}>
            {tags?.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <div className={styles.userDetails}>
            <Link href="/users/[user]" as={`/users/${author?.username}`}>
              <a>
                <img
                  src={`https://secure.gravatar.com/avatar/${author?.id}?s=32&d=identicon`}
                  alt={author?.username}
                />
              </a>
            </Link>
            <div className={styles.info}>
              <span>
                {tags ? 'asked' : 'answered'}{' '}
                {formatDistanceToNowStrict(new Date(created), {
                  addSuffix: true
                })}
              </span>
              <Link href="/users/[user]" as={`/users/${author?.username}`}>
                <a>
                  {author?.username} {editTime === 1 ? '(đã chỉnh sửa)' : ''}
                </a>
              </Link>
            </div>
          </div>
        </div>
        {authState
          ? (authState.userInfo?.id === author?.id || isAdmin()) && (
              <div className={styles.row}>
                <a
                  className={styles.delete}
                  onClick={() => handleDeleteComment()}
                >
                  Xoá
                </a>
              </div>
            )
          : ''}
      </div>
    </div>
  )
}

export default PostSummary
