using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Domain;
using System;
using MediatR;
using Application.Activities;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetActivities()
        {
            var activitiesList = await Mediator.Send(new List.Query());

            return Ok(activitiesList);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetActivity(Guid id)
        {
            var activity = await Mediator.Send(new Details.Query{Id = id});

            return Ok(activity);
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            await Mediator.Send(new Create.Command {Activity = activity});

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid Id, Activity activity)
        {
            activity.Id = Id;
            await Mediator.Send(new Edit.Command{Activity = activity});
            
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return Ok(await Mediator.Send(new Delete.Command{Id = id}));
        }
    }
}