import React, { useState, useEffect, useContext } from 'react'

import { AuthContext } from '../../../store/auth'
import ModalContext from '../../../store/modal'
import { useRouter } from 'next/router'
import AddComment from '../add-comment'

import styles from './comment-list.module.css'

const CommentList = ({
  children,
  questionId,
  answerId,
  setQuestion,
  author,
  editTime
}) => {
  const router = useRouter()
  const { isAuthenticated, authState } = useContext(AuthContext)
  const { handleComponentVisible } = useContext(ModalContext)

  const [showAddComment, setShowAddComment] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [visibleComments, setVisibleComments] = useState(children.slice(0, 3))
  const [difference, setDiffrence] = useState(null)

  useEffect(() => {
    setVisibleComments(children.slice(0, 3))
  }, [children])

  useEffect(() => {
    setDiffrence(children.length - visibleComments.length)
  }, [visibleComments])

  const handlerEdit = () => {
    setShowEdit(true)
    router.push(`/questions/edit?id=${questionId}`)
  }
  return (
    <div className={styles.commentCell}>
      {visibleComments}

      {difference > 0 ? (
        <a
          className={styles.showMore}
          onClick={() => setVisibleComments(children)}
        >
          show <b>{difference}</b> more comments
        </a>
      ) : !showAddComment || !showEdit ? (
        <>
          <a
            className={styles.addComment}
            onClick={() =>
              isAuthenticated()
                ? setShowAddComment(true)
                : handleComponentVisible(true, 'signup')
            }
          >
            Thêm bình luận
          </a>
          {authState?.userInfo?.id === author && editTime < 1 ? (
            <a
              className={styles.addComment}
              onClick={() =>
                isAuthenticated()
                  ? handlerEdit()
                  : handleComponentVisible(true, 'signup')
              }
            >
              Chỉnh sửa
            </a>
          ) : (
            ''
          )}
        </>
      ) : (
        ''
      )}

      {showAddComment && (
        <AddComment
          questionId={questionId}
          answerId={answerId}
          setShowAddComment={setShowAddComment}
          setQuestion={setQuestion}
        />
      )}
    </div>
  )
}

export default CommentList
