import React, { Component } from 'react'
import { of } from 'rxjs'
import { map } from 'rxjs/operators'

class Game extends Component {
  componentDidMount() {
    let res$ = of(1, 2, 3)

    res$.pipe(map((val) => val * 2)).subscribe((val) => {
      console.log('val :>> ', val)
    })
  }

  render() {
    return (
      <div>
        <h1>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore,
          vel deleniti. Facilis odio recusandae nam ea magni, nemo vitae sed in
          excepturi qui voluptatum adipisci officiis dolor quod eaque maiores.
        </h1>
      </div>
    )
  }
}

export default Game
