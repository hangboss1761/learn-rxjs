import React, { Component } from 'react'
import {
  BehaviorSubject,
  timer,
  Observable,
  fromEvent,
  combineLatest,
} from 'rxjs'
import { map, switchMap, scan, startWith, takeWhile } from 'rxjs/operators'
import './game.css'

type Letters = {
  /** 用于ui页面展示 */
  label: string
  /** 实际用来对比的值 */
  value: string
}

type GameInfo = {
  /** 字母信息 */
  letters: Letters[]
  /** 当前分数 */
  score: number
  /** 当前等级 */
  level: number
}

type GameState = {
  letters: Letters[]
  score: number
  level: number
  gameover: boolean
}

type GameProp = {}

type HeaderProp = {
  score: number
  level: number
}
type MainProp = {
  letters: Letters[]
}

/** 等级对应的间隔速度 1-8 级 */
const levelSpeed = [1000, 900, 800, 700, 300, 280, 250, 220]
/** 最大等级 */
const maxLevel = 8
/** 队列中最多存放20个字母，达到限度会被当作失败 */
const maxLettersLen = 20
/** 达到该分数进入到下一个level */
const maxLevelScore = 10
const noop = () => {}

const Header = (props: HeaderProp) => {
  return (
    <div>
      <span>Score: {props.score},</span>
      <span>Level: {props.level}</span>
    </div>
  )
}

const Main = (props: MainProp) => {
  return (
    <div>
      {props.letters.map((item, idx) => (
        <p key={idx} dangerouslySetInnerHTML={{ __html: item.label }}></p>
      ))}
    </div>
  )
}

const getRandomLetters = () =>
  String.fromCharCode(
    Math.random() * ('z'.charCodeAt(0) - 'a'.charCodeAt(0)) + 'a'.charCodeAt(0)
  )

const getOffsetLetterStr = (letter: string) =>
  `${'&nbsp;'.repeat(Math.ceil(Math.random() * 10))}${letter}`

const initLettersObservable = (defaultLevel = 1) => {
  return new BehaviorSubject(defaultLevel).pipe(
    switchMap((level) =>
      timer(0, levelSpeed[level - 1]).pipe(
        scan<number, GameInfo>(
          (acc) => {
            let letter = getRandomLetters()

            acc.letters.unshift({
              value: letter,
              label: getOffsetLetterStr(letter),
            })
            return acc
          },
          { letters: [], score: 0, level: level }
        )
      )
    )
  )
}

const initKeydownObservable = () => {
  return fromEvent(document, 'keydown').pipe(
    startWith({ key: '' }),
    map((e: any) => e.key)
  )
}

const handleTakeWhild = (val: [string, GameInfo]) => {
  let [, { level, score, letters }] = val
  return (
    level <= maxLevel &&
    score <= maxLevelScore &&
    letters.length < maxLettersLen
  )
}

const initGameObservable = (
  keydown$: Observable<string>,
  letters$: Observable<GameInfo>
) => {
  return combineLatest(keydown$, letters$).pipe(
    map((val: [string, GameInfo]) => {
      let [key, { letters }] = val

      if (letters.length && letters[letters.length - 1].value === key) {
        letters.pop()
        val[1].score++
      }

      if (val[1].level < maxLevel && val[1].score >= maxLevelScore) {
        val[1].level++
        ;(letters$ as any).next(val[1].level)
      }

      return val
    }),
    takeWhile(handleTakeWhild)
  )
}

class Game extends Component<GameProp, GameState> {
  state: GameState = {
    letters: [],
    score: 0,
    level: 1,
    gameover: false,
  }

  letters$: Observable<GameInfo>
  keydown$: Observable<string>
  game$: Observable<any>

  constructor(props: GameProp) {
    super(props)
    this.letters$ = initLettersObservable()
    this.keydown$ = initKeydownObservable()
    this.game$ = initGameObservable(this.keydown$, this.letters$)
  }

  componentDidMount() {
    this.game$.subscribe(
      (val: [string, GameInfo]) => {
        let [, { letters, score, level }] = val

        this.setState({
          letters,
          score,
          level,
        })
      },
      noop,
      () => this.setState({ gameover: true })
    )
  }

  isWin() {
    return this.state.level === maxLevel && this.state.score === maxLevelScore
  }

  render() {
    return (
      <div className="game-box">
        <Header score={this.state.score} level={this.state.level} />
        <Main letters={this.state.letters} />
        {this.state.gameover && <div>Game over</div>}
        {this.isWin() && <div>You Win!!!</div>}
      </div>
    )
  }
}

export default Game
