package com.example.controllers;

import com.example.services.NewsService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/news")
@Produces(MediaType.APPLICATION_JSON)
public class NewsController {

    @Inject NewsService newsService;

    @GET
    public Response getPublished(@QueryParam("category") String category) {
        return Response.ok(newsService.getPublished(category)).build();
    }

    @GET @Path("/{slug}")
    public Response getBySlug(@PathParam("slug") String slug) {
        return Response.ok(newsService.getBySlug(slug)).build();
    }
}