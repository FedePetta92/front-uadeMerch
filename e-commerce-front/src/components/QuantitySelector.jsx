function QuantitySelector({ cantidad, onChange, min = 1, max}) {
  return (
    <div className="quantity-selector">
      <button 
        type="button" 
        className="qty-btn" 
        onClick={() => onChange(Math.max(min, cantidad - 1))}
        disabled={cantidad <= min}
      >
        -
      </button>
      
      <span className="qty-number">{cantidad}</span>
      
      <button 
        type="button" 
        className="qty-btn" 
        onClick={() => onChange(Math.min(max, cantidad + 1))}
        disabled={cantidad >= max}
      >
        +
      </button>
    </div>
  )
}

export default QuantitySelector
