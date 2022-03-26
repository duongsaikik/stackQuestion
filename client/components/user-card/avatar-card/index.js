import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'

import { publicFetch } from '../../../util/fetcher'

import { Spinner } from '../../icons'

import styles from './avatar-card.module.css'

const UserAvatar = ({ username }) => {
  const [userInfo, setUserInfo] = useState(null)


    useEffect(() => {
      var request = {
        params :{
          username: username
        }
      }
      const fetchUser = async () => {
        const { data } = await publicFetch.get(`/user/find`,request)
        setUserInfo(data)
      }
  
      fetchUser()
  }, [username])
  
  return (
    <div>
      <div className={styles.avatarCard}>
        {!userInfo ? (
          <div className="loading">
            <Spinner />
          </div>
        ) : (
          <div className={styles.avatar}>
            <Link href="/users/[username]" as={`/users/${username}`}>
              <a>
                <img
                  src={`https://secure.gravatar.com/avatar/${userInfo.id}?s=164&d=identicon`}
                  alt={username}
                />
              </a>
            </Link>
          </div>
        )}
        <h2 className={styles.username}>{username}</h2>
        {!userInfo ? (
          <div className="loading">
            <Spinner />
          </div>
        ) : (
          <div className={styles.created}>
            <p>
            Câu hỏi:{' '}
              {(userInfo.questionsMount==undefined) ? (
                <Spinner />
              ):(
                  <span>
                  {userInfo.questionsMount}
                  </span>
              )}
              
            </p>
          </div>
        )}

        {!userInfo ? (
          <div className="loading">
            <Spinner />
          </div>
        ) : (
          <div className={styles.created}>
            <p>
            Trả lời:{' '}
              {(userInfo.answersMount == undefined) ? (
                <Spinner />
              ):(
                  <span>
                  {userInfo.answersMount}
                  </span>
              )}
              
            </p>
          </div>
        )}

        {!userInfo ? (
          <div className="loading">
            <Spinner />
          </div>
        ) : (
          <div className={styles.created}>
            <p>
            Độ uy tín:{' '}
              {(userInfo.score == undefined) ? (
                <Spinner />
              ):(
                  <span>
                  {userInfo.score}
                  </span>
               )}
              
            </p>
          </div>
        )}

        {!userInfo ? (
          <div className="loading">
            <Spinner />
          </div>
        ) : (
          <div className={styles.created}>
            <p>
              Thời gian tạo:{' '}
              <span>
                {formatDistanceToNowStrict(new Date(userInfo.created), {
                  addSuffix: true
                })}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserAvatar;
