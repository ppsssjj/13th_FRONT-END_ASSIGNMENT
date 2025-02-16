function NumButton({ value, onClick }) {
    return (
      <div className="num_buttons" onClick={() => onClick(value)}>
        {value}
      </div>
    );
  }
  
  export default NumButton;
  