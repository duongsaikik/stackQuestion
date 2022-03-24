import React, { useContext } from 'react'

import { AuthContext } from '../../../store/auth'
import { FetchContext } from '../../../store/fetch'
import ModalContext from '../../../store/modal'

import Button from '../../button'
import { ArrowUp, ArrowDown } from '../../icons'
import CheckIcon from '../../icons/CheckIcon'
import cn from "classnames";
import styles from './post-vote.module.css'

const PostVote = ({
  score,
  votes,
  questionId,
  answerId,
  setQuestion,
  checkAnswer,
  check,
  id }) => {
  const { authState, isAuthenticated } = useContext(AuthContext)
  const { authAxios } = useContext(FetchContext)
  const { handleComponentVisible } = useContext(ModalContext)

  const exists = () => {
    if (votes.find((v) => v.user === authState.userInfo?.id)) {
      return true;
    }
    return false;
  }

  const isUpVoted = () => {
    return votes.find((v) => v.user === authState.userInfo?.id)?.vote === 1
  }

  const isDownVoted = () => {
    return votes.find((v) => v.user === authState.userInfo?.id)?.vote === -1
  }

  const upVote = async () => {
    const { data } = await authAxios.get(
      `/votes/upvote/${questionId}/${answerId ? answerId : ''}`
    )
    setQuestion(data)
  }

  const downVote = async () => {
    const { data } = await authAxios.get(
      `/votes/downvote/${questionId}/${answerId ? answerId : ''}`
    )
    setQuestion(data)
  }

  const unVote = async () => {
    const { data } = await authAxios.get(
      `/votes/unvote/${questionId}/${answerId ? answerId : ''}`
    )
    setQuestion(data)
  
  }

  const checkVote = async () => {
    const { data } = await authAxios.get(
      `/votes/checkvote/${questionId}/${answerId ? answerId : ''}`
    )
    setQuestion(data)
    console.log(data)
  }

  return (
    <div className={styles.voteCell}>
      <Button
        className={cn(styles.voteButton, isUpVoted() ? '' : isDownVoted() ? styles.hide : '')}
        onClick={() =>
          isAuthenticated()
            ? isUpVoted()
              ? unVote()
              : upVote()
            : handleComponentVisible(true, 'login')
        }
      >
        <ArrowUp className={isUpVoted() ? styles.voted : exists() ? styles.hide : ''} />
      </Button>
      <div className={styles.score}>{score}</div>
      <Button
        className={cn(styles.voteButton, isDownVoted() ? '' : isUpVoted() ? styles.hide : '')}
        onClick={() =>
          isAuthenticated()
            ? isDownVoted()
              ? unVote()
              : downVote()
            : handleComponentVisible(true, 'login')
        }
      >
        <ArrowDown className={isDownVoted() ? styles.voted : exists() ? styles.hide : ''} />
      </Button>
      {
        isAuthenticated()?
        id === authState.userInfo.id
          ? check
            ? checkAnswer
              ? <Button className={cn(styles.voteButton,styles.situation,styles.checkBtn)}>
                <CheckIcon className={styles.checkVote} />
              </Button>
              : ''
            : <Button className={cn(styles.voteButton,styles.situation)}
              onClick={() => {
                isAuthenticated() ?
                  checkVote()
                  : handleComponentVisible(true, 'login')
              }}
            >
              <CheckIcon className={styles.vote} />
            </Button>
          : ''
          :''

      }


    </div>
  )
}

export default PostVote
