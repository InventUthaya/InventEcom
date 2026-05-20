namespace DofyEcom.Model;

using AutoMapper;
using DofyEcom.Helper;
using Microsoft.Extensions.Options;
using System.Collections.Generic;

public class MasterCacheBindingModel
{
    private readonly IOptionsSnapshot<AppConfiguration> config;
    private readonly IMapper mapper;

    public MasterCacheBindingModel(IOptionsSnapshot<AppConfiguration> iConfig, IMapper iMapper)
    {
        this.config = iConfig;
        this.mapper = iMapper;
    }

   
}