const TextList = (props) => {
  //create array of item components
  const items = props.gifs.map((itemData) => {
    console.log(itemData);
    return <Item url={itemData.url} />;
  });
  return <div className="text-container grid grid-cols-4 gap-2">{items}</div>;
};
const Item = (props) => {
  return (
    <div className="gif-item">
      <img src={props.url} className="max-w-[100px]" />
    </div>
  );
};
export default TextList;
