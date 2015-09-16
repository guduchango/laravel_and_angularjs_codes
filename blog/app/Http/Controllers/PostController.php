<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Post;
use Auth;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
       return Post::with(['user'=>function($q){
                    $q->select('id','name','email');
                }])->get();
    }

     public function getTitles()
    {
       return Post::select('id','title')->get();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store()
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        return Post::select('*')
               ->with(['user'=>function($q){
                    $q->select('id','name','email');
                }])
            ->find($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }

    public function save(Request $request){

        if (Auth::user()==null)
                throw new \Exception("Login required");

        if ($request->id!=null && Auth::user()->id!=$request->user_id)
                throw new \Exception("You can edit only your posts");
            
        $post = null;
        if ($request->id){ //edit
            $post=Post::find($request->id);
        }else{ //new
            $post = new Post();
        }
        $post->user_id = Auth::user()->id;
        $post->title = $request->title;
        $post->text = $request->text;
        $post->active = $request->active;
        $post->save();
        return $post;
    }

  /**
    * Get posts in chronological order
     * @param  int  $n number of posts 
     * @return Collection Posts collection
    */
    public function last($n=3){
       
        return Post::select('id','title', 'text','active','user_id')
            ->with(['tags'=>function($q){
                    $q->select('id','title');
                }])
            ->with(['comments'=>function($q){
                    $q->active()->select('active','post_id');
                }])
            ->with(['user'=>function($q){
                    $q->select('id','name','email');
                }])
            ->orderBy('id', 'desc')
            ->take($n)
            ->get();
    }
}
