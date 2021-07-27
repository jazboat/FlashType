import React from 'react'

const ItemList = ({ name, data, symble, ...rest }) => {
	return (
		<li className="list-item border rounded" {...rest}>
			{name}
			<span className="block display-4">
				{data}
				{symble && data > 0 ? <small>{symble}</small> : ''}
			</span>
		</li>
	)
}

export default ItemList