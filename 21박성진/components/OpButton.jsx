function OpButton({ value, onClick }) {
    return (
      <div className="op_buttons" onClick={() => onClick(value)}>
        {value}
      </div>
    );
  }
  
  export default OpButton;
  