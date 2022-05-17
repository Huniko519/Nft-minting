import { toast } from 'react-toastify';
import { ethers } from "ethers"
const proxy = process.env.REACT_APP_PROXY || ''

export const tips = (html) => {
	toast(html, {
		position: "top-right",
		autoClose: 3000,
		closeButton: false,
		style: {
			backgroundColor: 'rgba(11, 11, 8, 0.92)',
			color: '#fff',
			fontSize: '1.2rem',
			border: '1px solid #888',
			boxShadow: '1px 2px 2px #5f553e'
		}
	});
}

export const NF = (num, p = 2) => num.toLocaleString('en', { maximumFractionDigits: p });

export const copyToClipboard = (text) => {
	var textField = document.createElement('textarea')
	textField.innerText = text
	document.body.appendChild(textField)
	textField.select()
	document.execCommand('copy')
	textField.remove()
	tips("Copied : " + text); 
};

export const call = async (url, params) => {
	try {
		const result = await fetch(proxy + url, { method: "post", headers: { 'content-type': 'application/json'}, body: params ? JSON.stringify(params) : null });
		return await result.json();
	} catch (error) {
		console.log(error)
	}
	return null
}

/**
 * set delay for delayTimes
 * @param {Number} delayTimes - timePeriod for delay
 */
export const delay = (delayTimes) => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(2);
		}, delayTimes);
	});
}

/**
 * change data type from Number to BigNum 
 * @param {Number} value - data that need to be change
 * @param {Number} d - decimals
 */
export const toBigNum = (value, d) => {
	return ethers.utils.parseUnits(Number(value).toFixed(d), d);
}

/**
 * change data type from BigNum to Number
 * @param {BigNumber} value - data that need to be change
 * @param {Number} d - decimals
 */
export const fromBigNum = (value, d) => {
	return parseFloat(ethers.utils.formatUnits(value, d));
}


