function MainContainer(props) {
    return (
        <div className={"container mainContainer"}>
            {props.children}
        </div>
    );
}

export default MainContainer;