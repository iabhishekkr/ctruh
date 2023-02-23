import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import "./CanvasElem.css"

function CanvasElem() {
    const [myStyle, setMyStyle] = useState({ height: window.innerHeight / 3, width: window.innerWidth / 2, backgroundColor: '#000000' });
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    const [color, setColor] = useState("#000000");
    const [color2, setColor2] = useState("#ffffff");
    const a = Math.floor(Math.random() * 90) + 10;
    const [num, setNum] = useState(a + "");
    const [number, setNumber] = useState(a + "");
    const [error, setError] = useState(false);
    const colorSelector = (e) => {
        setColor(e.target.value);
        setMyStyle({ ...myStyle, backgroundColor: `${e.target.value}` })
    }
    const style2 = {
        backgroundColor: `${color}`,
        color: `${color2}`
    }

    const canvasRef = useRef(null);

    function invertColor(hex) {
        // console.log(hex);
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        // convert 3-digit hex to 6-digits.
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        // invert color components
        var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
            g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
            b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
        // pad each with zeros and return
        return '#' + padZero(r) + padZero(g) + padZero(b);
    }

    function padZero(str, len) {
        len = len || 2;
        var zeros = new Array(len).join('0');
        return (zeros + str).slice(-len);
    }

    const numSet = (e) => {
        setNum(e.target.value);
        setError(false);
    }

    const btnHandler = (e) => {
        e.preventDefault();
        if (num.length == 2)
            setNumber(num);
        else
            setError(true);

    }


    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d');
        ctx.font = "3vw Comic Sans MS";
        const c = invertColor(color);
        setColor2(c);
        ctx.fillStyle = c;
        ctx.textAlign = "center";
        ctx.clearRect(0, 0, 200, 200);
        ctx.font = "50px Comic Sans MS";
        console.log(canvas.width);
        ctx.fillText(`${number}`, canvas.width / 2, canvas.height / 1.7);
        const setter = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight)
            setMyStyle({
                ...myStyle,
                height: `${window.innerHeight / 3}px`,
                width: `${window.innerWidth / 2}px`,
            })
            // console.log(window.innerHeight, width);
        }
        window.addEventListener('resize', setter);

        return () => {
            window.removeEventListener('resize', setter);
        }
    });

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d');

        canvas.addEventListener('mousemove', (event) => {
            console.log("canvas " + width, height, event.clientX, event.clientY);

            if (Math.abs((width / 2) - event.clientX) <= 50 && Math.abs((height / 2) - event.clientY) <= 50) {
                console.log('true');
                context.clearRect(0, 0, 200, 200);
                context.font = "80px Comic Sans MS";
                context.fillText(`${number}`, canvas.width / 2, canvas.height / 1.5);

            }
            else {
                context.clearRect(0, 0, 200, 200);
                context.font = "50px Comic Sans MS";
                context.fillText(`${number}`, canvas.width / 2, canvas.height / 1.7);
            }
        });

        return () => {
            // canvas.removeEventListener('mousemove', )
        }
    })

    return (
        <div className='main'>
            <div className="picker">
                <label htmlFor="color-picker" style={{ color: `${color}` }}>Pick your color</label> <br /> <br />
                <input type="color" name="color-picker" id="color-picker" value={color} onChange={colorSelector} />
            </div>
            <br />
            <div className="canvas">
                <canvas style={myStyle} ref={canvasRef} >
                </canvas>
            </div>

            <br />
            <div className="num-input">
                <input id='num' type="number" placeholder='Enter two digit number' onChange={numSet} value={num} style={style2} />
                <button type='submit' onClick={btnHandler} style={style2}>Submit</button>
            </div>
            {
                error && <div style={{ color: 'red' }}>Please enter two digit number only</div>
            }
        </div>
    )
}

export default CanvasElem
