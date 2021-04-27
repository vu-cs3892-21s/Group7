import pandas as pd
import pathlib

from .database import db


def load_question_type(question_type: str, file_name: str) -> None:
    question_df = pd.read_csv(
        f"/server/src/db/data/{file_name}", sep="\t"
    ).drop_duplicates(subset=["question"])
    question_df["question_type"] = question_type
    question_df.to_sql("question", con=db.engine, if_exists="append",
                       method="multi", index=False, chunksize=1000)


def load_questions() -> None:
    load_question_type(
        "Kth_biggest", "comparison__kth_biggest.csv")
    load_question_type(
        "Sequence", "algebra__sequence_next_term.csv")
    load_question_type(
        "Bases", "numbers__base_conversion.csv")
    db.session.commit()
