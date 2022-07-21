import React from 'react';

const Container = (props) => {
  return (
    <main className="container">
      <header className="container__header">
        <h3 className="container__title">{props.title}</h3>
        {props.btnTxt && (
          <button className={`container__btn ${props.btnClass}`}>
            {props.btnTxt}
          </button>
        )}
      </header>
      <div className="container__content--holder">{props.children}</div>
    </main>
  );
};

export default Container;
