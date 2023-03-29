from fastapi import APIRouter, Depends, Response
from typing import List, Optional, Union
from queries.posts import (
    Error,
    PostIn,
    PostOut,
    PostRepository
)

router = APIRouter()

@router.post('/api/posts', response_model=Union[PostOut, Error])
def create_post(
    post: PostIn,
    response: Response,
    repo: PostRepository = Depends(),
):
    response = repo.create_post(post)
    if response is None:
        response.status_code = 400
    else:
        return response

@router.delete("/api/posts/{post_id}", response_model= bool)
def delete_post(
    post_id: int,
    response: Response,
    repo: PostRepository = Depends(),
)-> bool:
    response = repo.delete(post_id)
    if response is None:
        response.status_code = 400
    return response