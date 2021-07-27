import React, { useState, useRef, useEffect } from 'react'
import { quotesArray, random, allowedKeys } from './Helper'
import ItemList from './components/ItemList'
import './App.css'

let interval = null

const App = () => {
	const inputRef = useRef(null)
	const outputRef = useRef(null)
	const [ duration, setDuration ] = useState(60)
	const [ started, setStarted ] = useState(false)
	const [ ended, setEnded ] = useState(false)
	const [ index, setIndex ] = useState(0)
	const [ correctIndex, setCorrectIndex ] = useState(0)
	const [ errorIndex, setErrorIndex ] = useState(0)
	const [ quote, setQuote ] = useState({})
	const [ input, setInput ] = useState('')
	const [ cpm, setCpm ] = useState(0)
	const [ wpm, setWpm ] = useState(0)
	const [ accuracy, setAccuracy ] = useState(0)
	const [ isError, setIsError ] = useState(false)
	const [ lastScore, setLastScore ] = useState('0')






	useEffect(() => {
		const newQuote = random(quotesArray)
		setQuote(newQuote)
		setInput(newQuote.quote)
	}, [])

	const handleEnd = () => {
		setEnded(true)
		setStarted(false)
		clearInterval(interval)
	}

	const setTimer = () => {
		const now = Date.now()
		const seconds = now + duration * 1000
		interval = setInterval(() => {
			const secondLeft = Math.round((seconds - Date.now()) / 1000)
			setDuration(secondLeft)
			if (secondLeft === 0) {
				handleEnd()
			}
		}, 1000)
	}

	const handleStart = () => {
		setStarted(true)
		setEnded(false)
		setInput(quote.quote)
		inputRef.current.focus()
		setTimer()
	}

	const handleKeyDown = e => {
		e.preventDefault()
		const { key } = e
		const quoteText = quote.quote

		if (key === quoteText.charAt(index)) {
			setIndex(index + 1)
			const currenChar = quoteText.substring(index + 1, index + quoteText.length)
			setInput(currenChar)
			setCorrectIndex(correctIndex + 1)
			setIsError(false)
			outputRef.current.innerHTML += key
		} else {
			if (allowedKeys.includes(key)) {
				setErrorIndex(errorIndex + 1)
				setIsError(true)
				outputRef.current.innerHTML += `<span class="text-danger">${key}</span>`
			}
		}

		const timeRemains = ((60 - duration) / 60).toFixed(2)
		const accuracy_ = Math.floor((index - errorIndex) / index * 100)
		const wpm_ = Math.round(correctIndex / 5 / timeRemains)

		if (index > 5) {
			setAccuracy(accuracy_)
			setCpm(correctIndex)
			setWpm(wpm_)
		}

		if (index + 1 === quoteText.length || errorIndex > 50) {
			handleEnd()
		}
	}

	useEffect(
		() => {
			if (ended) localStorage.setItem('wpm', wpm)
		},
		[ ended, wpm ]
	)
	useEffect(() => {
		const stroedScore = localStorage.getItem('wpm')
		if (stroedScore) setLastScore(stroedScore)
	}, [])




	return (
		<div className="App">
			<div className="container-fluid">
				<div className="row">
					<div className=" rows ">
						<ul className="list-unstyled text-center small">
							<ItemList
								name="WPM"
								data={wpm}
								style={
									wpm > 0 && wpm < 20 ? (
										{ color: 'white', backgroundColor: '#eb4841' }
									) : wpm >= 20 && wpm < 40 ? (
										{ color: 'white', backgroundColor: '#f48847' }
									) : wpm >= 40 && wpm < 60 ? (
										{ color: 'white', backgroundColor: '#ffc84a' }
									) : wpm >= 60 && wpm < 80 ? (
										{ color: 'white', backgroundColor: '#a6c34c' }
									) : wpm >= 80 ? (
										{ color: 'white', backgroundColor: '#4ec04e' }
									) : (
										{}
									)
								}
							/>
							<ItemList name="CPM" data={cpm} />
							<ItemList name="Last Score" data={lastScore} />
						</ul>
					</div>

					<div className="middle-container  order-1">
						<div className="container">
							<div className="text-center ">
								<h1 className="heading-main">빨리 타자</h1>
								<h2 className="heading-second">FLASH TYPE</h2>
								
								<p className="lead">
									Start by pressing "START " and I can tell you how fast you typed. GOOD LUCK!
								</p>

								<div className="alert" role="alert">
									Just start typing and don't use <b>backspace</b> to correct your mistakes, just keep going.
								</div>

								<div className="control">
									{ended ? (
										<button
											className="btn btn-reload btn-circle"
											onClick={() => window.location.reload()}
										>
											Reload
										</button>
									) : started ? (
										<button className="btn btn-circle btn-type " disabled>
											TYPE
										</button>
									) : (
										<button className="btn btn-circle btn-start" onClick={handleStart}>
											START!
										</button>
									)}
									<span className="btn-circle-animation" />
								</div>
							</div>

							{ended ? (
								<div className="quote-text text-light text-quote lead rounded">
									<span>"{quote.quote}"</span>
									<span className="block  text-muted small">- {quote.author}</span>
								</div>
							) : started ? (
								<div
									className={`text-light quotes${started ? ' active' : ''}${isError
										? ' is-error'
										: ''}`}
									tabIndex="0"
									onKeyDown={handleKeyDown}
									ref={inputRef}
								>
									{input}
								</div>
							) : (
								<div className="quotes text-muted" tabIndex="-1" ref={inputRef}>
									{input}
								</div>
							)}

							<div className="quotes-output quote-text text-light rounded lead" ref={outputRef} />


							<div className="meter-container">
								<h6 className="heading">타자 속도</h6>
								<div className="meter-gauge">
									<span className="average-score" style={{ background: '#eb4841' }}>
										0 - 20 Slow
									</span>
									<span className="average-score" style={{ background: '#f48847' }}>
										20 - 40 Average
									</span>
									<span className="average-score" style={{ background: '#ffc84a' }}>
										40 - 60 Fast
									</span>
									<span className="average-score" style={{ background: '#a6c34c' }}>
										60 - 80 Professional
									</span>
									<span className="average-score" style={{ background: '#4ec04e' }}>
										80 - 100+ Top Teir
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="rows order-2 ">
						<ul className="list-unstyled text-center small">
							<ItemList name="Timers" data={duration} />
							<ItemList name="Errors" data={errorIndex} />
							<ItemList name="Acuracy" data={accuracy} symble="%" />
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

export default App