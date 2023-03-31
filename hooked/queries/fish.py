from pydantic import BaseModel
from typing import List, Optional, Union
from datetime import date
from queries.pool import pool

class Error(BaseModel):
    message: str

class FishIn(BaseModel):
    name: str
    size: str
    fishing_technique: str
    type: str

class FishOut(BaseModel):
    id:int
    name: str
    size: str
    fishing_technique: str
    type: str


class FishRepository:
    def get_all_fish(self) -> Optional[FishOut]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        SELECT id, name, size, fishing_technique, type
                        FROM fish
                        ORDER BY id
                        """
                    )
                    return [
                        self.record_to_fish_out(record)
                        for record in result
                    ]
        except Exception:
            return {"message": "Unable to successfully create a fish"}

    def create_fish(self, fish: FishIn) -> Union[FishOut, Error]:
        try:
            with pool.connection() as conn:
                with conn.cursor() as db:
                    result = db.execute(
                        """
                        INSERT INTO fish (name, size, fishing_technique, type)
                        VALUES (%s, %s, %s, %s)
                        RETURNING id;
                        """,
                    [fish.name, fish.size, fish.fishing_technique, fish.type]
                    )
                    id = result.fetchone()[0]
                    if id is None:
                        return None
                    return self.record_to_fish_in_to_out(id, fish)
        except Exception:
            print("Create fish did not work")
            return None

    def delete_fish(self, fish_id: int) -> Union[bool, Error]:
        try:
            with pool.connection() as connection:
                with connection.cursor() as db:
                    db.execute(
                        """
                        DELETE from fish
                        WHERE id = %s
                        """,
                        [fish_id]
                    )
                    return True
        except Exception as e:
            return {"message": "User does not exists"}


    def record_to_fish_in_to_out(self, id: int, fish: FishIn):
        old_data = fish.dict()
        return FishOut(id=id, **old_data)

    def record_to_fish_out(self, record):
        return FishOut(
            id=record[0],
            name=record[1],
            size=record[2],
            fishing_technique=record[3],
            type=record[4]
            )
