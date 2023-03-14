function MainContainer(props) {
    return (
        <div className={"container main_Container"}>
            {props.children}
        </div>
    );
}

export default MainContainer;