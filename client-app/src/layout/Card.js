import '../styles/layout_styles.scss';

function Card1(props) {
    return (
        <div className={"cardContainer " + (props.className ? props.className : "")}
             style={{width: props.width ? props.width : "100%"}}>
            {props.children}
        </div>
    );
}

export default Card1;