function QuantitySelector({cantidad, onChange, min = 0, max}) {
    const restar = () => {
        if (cantidad > min) onChange(cantidad - 1)
    }

    const sumar = () => {
        if (cantidad < max) onChange(cantidad + 1)
    }

    return (
        <div className="quantity-selector">
            <button onClick={restar} disabled={cantidad <= min}>-</button>
            <span>{cantidad}</span>
            <button onClick={sumar} disabled={cantidad >= max}>+</button>
        </div>
    )
}

export default QuantitySelector
